package org.cms.SystemAdministration.Controllers;

import org.cms.SystemAdministration.Models.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Controller {

    @GetMapping("")
    public User getUser() {
        return new User((int)Math.random()*100, "Dilan", "Admin");
    }
}
