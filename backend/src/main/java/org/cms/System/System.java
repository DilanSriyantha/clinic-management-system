package org.cms.System;

import org.cms.Main;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class System {
    private static System mInstance;
    private static ConfigurableApplicationContext mContext;

    public System() {
        registerStdInListener();
    }

    public static System getInstance() {
        if(mInstance == null)
            mInstance = new System();

        return mInstance;
    }

    public void start(Class<Main> mainClass, String[] args) {
        mContext = SpringApplication.run(mainClass, args);
    }

    public void shutDown() throws Exception {
        SpringApplication.exit(mContext);
    }

    public void registerStdInListener() {
        new Thread(() -> {
            Scanner scanner = new Scanner(java.lang.System.in);
            if(scanner.hasNext("exit")) {
                try {
                    shutDown();
                    java.lang.System.out.println("exit_code: " + 0);
                } catch (Exception ex) {
                    java.lang.System.out.println("exit_code: " + 1);
                }
            }
        }).start();
    }
}
