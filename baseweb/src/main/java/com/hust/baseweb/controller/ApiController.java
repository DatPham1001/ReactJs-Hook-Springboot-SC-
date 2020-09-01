package com.hust.baseweb.controller;


import com.hust.baseweb.entity.Party;
import com.hust.baseweb.entity.Person;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.model.PasswordChangeModel;
import com.hust.baseweb.service.PersonService;
import com.hust.baseweb.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class ApiController {

    private UserService userService;
    private PersonService personService;

    @GetMapping("/")
    public ResponseEntity<Map> home(Principal principal) {
        UserLogin userLogin = userService.findById(principal.getName());
        Map<String, String> response = new HashMap<>();
        HttpHeaders responseHeaders = new HttpHeaders();

        response.put("user", principal.getName());
        responseHeaders.set("Access-Control-Expose-Headers", "X-Auth-Token");

        return ResponseEntity.ok().headers(responseHeaders).body(response);
    }

    @GetMapping("/my-account")
    public ResponseEntity<?> getAccount(Principal principal) {
        UserLogin userLogin = userService.findById(principal.getName());
        Party party = userLogin.getParty();
        Person person = personService.findByPartyId(party.getPartyId());
        Map<String, String> response = new HashMap<>();

        response.put("name", person.getFullName());
        response.put("partyId", person.getPartyId().toString());
        response.put("user", principal.getName());

        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody PasswordChangeModel passwordChangeModel) {
        UserLogin userLogin = userService.findById(principal.getName());

        if (UserLogin.PASSWORD_ENCODER.matches(passwordChangeModel.getCurrentPassword(), userLogin.getPassword())) {
            UserLogin user = userService.updatePassword(userLogin, passwordChangeModel.getNewPassword());
            return ResponseEntity.ok().body("");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password isn't correct");
    }
}

