package org.cms;

import org.cms.System.System;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class Main {
    public static void main(String[] args) {
        System.getInstance().start(Main.class, args);
    }
}