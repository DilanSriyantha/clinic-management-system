package org.cms.SystemAdministration.Controllers;

import org.cms.SystemAdministration.Models.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class Controller {

    @GetMapping("/get")
    public User getUser(@RequestParam int id) {
        return new User((int)Math.random()*100, "Dilan", "Admin");
    }
}
