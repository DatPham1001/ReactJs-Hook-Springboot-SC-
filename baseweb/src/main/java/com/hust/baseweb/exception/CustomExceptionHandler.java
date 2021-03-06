package com.hust.baseweb.exception;

import org.springframework.beans.TypeMismatchException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Path;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    private Set<String> errorFields;

    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(final HttpRequestMethodNotSupportedException ex,
                                                                         final HttpHeaders headers,
                                                                         final HttpStatus status,
                                                                         final WebRequest request) {
        final StringBuilder builder = new StringBuilder();

        builder.append(ex.getMethod());
        builder.append(" Method is not supported for this request. Supported methods are:");
        ex.getSupportedHttpMethods().forEach(t -> builder.append(" " + t));

        ResponseSecondType response = new ResponseSecondType(415, ex.getLocalizedMessage(), builder.toString());

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(final HttpMediaTypeNotSupportedException ex, final HttpHeaders headers, final HttpStatus status, final WebRequest request) {
        final StringBuilder builder = new StringBuilder();

        builder.append(ex.getContentType());
        builder.append("Media type is not supported. Supported media types are: ");
        ex.getSupportedMediaTypes().forEach(t -> builder.append(t + " "));

        ResponseSecondType response = new ResponseSecondType(415, ex.getLocalizedMessage(), builder.substring(0, builder.length() - 2));
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Request param missing.
    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(final MissingServletRequestParameterException ex,
                                                                          final HttpHeaders headers,
                                                                          final HttpStatus status,
                                                                          final WebRequest request) {

        ResponseSecondType response = new ResponseSecondType(400, ex.getLocalizedMessage(),
                ex.getParameterName() + " parameter is missing");

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Cannot convert to target type.
    @Override
    protected ResponseEntity<Object> handleTypeMismatch(final TypeMismatchException ex,
                                                        final HttpHeaders headers,
                                                        final HttpStatus status,
                                                        final WebRequest request) {

        ResponseSecondType response = new ResponseSecondType(400, ex.getLocalizedMessage(),
                ex.getValue() + " value for " + ex.getPropertyName() + " should be of type " + ex.getRequiredType());

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @Override
    public ResponseEntity<Object> handleHttpMessageNotReadable(final HttpMessageNotReadableException ex,
                                                               HttpHeaders headers,
                                                               HttpStatus status,
                                                               WebRequest request) {

        ResponseSecondType response = new ResponseSecondType(400, ex.getLocalizedMessage(), ex.getMessage());

        return ResponseEntity.status(response.getStatus()).body(response);/*this.handleExceptionInternal(ex, response, headers, HttpStatus.valueOf(response.getStatus()), request);*/
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(final MethodArgumentNotValidException ex,
                                                                  final HttpHeaders headers,
                                                                  final HttpStatus status,
                                                                  final WebRequest request) {
        BindingResult result = ex.getBindingResult();
        List<FieldError> fieldErrors = result.getFieldErrors();

        ResponseFirstType response = new ResponseFirstType(400);
        errorFields = new HashSet<>();

        for (FieldError fieldError : fieldErrors) {
            if (errorFields.contains(fieldError.getField())) continue;
            errorFields.add(fieldError.getField());
            response.addError(fieldError.getField(), "argument not valid", fieldError.getDefaultMessage());
        }

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestPart(final MissingServletRequestPartException ex,
                                                                     final HttpHeaders headers,
                                                                     final HttpStatus status,
                                                                     final WebRequest request) {

        ResponseSecondType response = new ResponseSecondType(400, ex.getLocalizedMessage(),
                ex.getRequestPartName() + " part is missing");

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @Override
    protected ResponseEntity<Object> handleBindException(final BindException ex,
                                                         final HttpHeaders headers,
                                                         final HttpStatus status,
                                                         final WebRequest request) {

        BindingResult result = ex.getBindingResult();
        List<FieldError> fieldErrors = result.getFieldErrors();

        ResponseFirstType response = new ResponseFirstType(400);
        errorFields = new HashSet<>();

        for (FieldError fieldError : fieldErrors) {
            if (errorFields.contains(fieldError.getField())) continue;
            errorFields.add(fieldError.getField());
            response.addError(fieldError.getField(), "bind exception", fieldError.getDefaultMessage());
        }

        for (final ObjectError error : ex.getBindingResult().getGlobalErrors()) {
            response.addError(error.getObjectName(), "bind exception", error.getDefaultMessage());
        }

        return handleExceptionInternal(ex, response, headers, HttpStatus.valueOf(response.getStatus()), request);
    }

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(final NoHandlerFoundException ex,
                                                                   final HttpHeaders headers,
                                                                   final HttpStatus status,
                                                                   final WebRequest request) {

        ResponseSecondType response = new ResponseSecondType(415, ex.getLocalizedMessage(),
                "No handler found for " + ex.getHttpMethod() + " " + ex.getRequestURL());

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> handleMethodArgumentTypeMismatch(final MethodArgumentTypeMismatchException ex) {
        ResponseSecondType response = new ResponseSecondType(400, ex.getLocalizedMessage(),
                ex.getName() + " should be of type " + ex.getRequiredType().getName());

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolation(final ConstraintViolationException ex,
                                                            final WebRequest request) {

        ResponseFirstType response = new ResponseFirstType(400);
        errorFields = new HashSet<>();
        String field = null;

        for (final ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            if (errorFields.contains(violation.getPropertyPath().toString())) continue;

            errorFields.add(violation.getPropertyPath().toString());

            for (Path.Node node : violation.getPropertyPath()) {
                field = node.getName();
            }

            response.addError(field, "parameter not valid", violation.getMessage());
        }

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @ExceptionHandler(value = {AccessDeniedException.class})
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        ResponseSecondType response = new ResponseSecondType(403, "Forbidden", ex.getMessage());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(final Exception ex, final WebRequest request) {
        ResponseSecondType response = new ResponseSecondType(500, "Internal server error", ex.getLocalizedMessage());

        return ResponseEntity.status(response.getStatus()).body(response);
    }
}