package org.cms;

import org.cms.System.System;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        System.getInstance().start(Main.class, args);
    }
}