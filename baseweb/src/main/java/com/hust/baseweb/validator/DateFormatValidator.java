package com.hust.baseweb.validator;

import com.hust.baseweb.utils.Constant;
import lombok.extern.log4j.Log4j2;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeParseException;
import java.util.Date;

@Log4j2
public class DateFormatValidator implements ConstraintValidator<DateFormat, String> {

    @Override
    public void initialize(DateFormat customDate) {
    }

    @Override
    public boolean isValid(String customDateField, ConstraintValidatorContext cxt) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(Constant.DATE_FORMAT);
            sdf.setLenient(false);

            return sdf.parse(customDateField).compareTo(new Date()) >= 0;
        } catch (DateTimeParseException | ParseException e) {
            return false;
        }
    }

}