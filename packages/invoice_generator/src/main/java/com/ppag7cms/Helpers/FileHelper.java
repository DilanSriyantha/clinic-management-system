package com.ppag7cms.Helpers;

import java.io.File;

public class FileHelper {
    
    public static File init(String filePath, String fileName) {
        File dir = new File(filePath);

        if(!dir.exists())
            dir.mkdirs();

        return new File(dir, fileName);
    }

    public static File initDir(String path) {
        File dir = new File(path);

        if(!dir.exists())
            dir.mkdirs();

        return dir;
    }

    public static File createEmptyFile(String filePath, String fileName) {
        return init(filePath, fileName);
    }
}
