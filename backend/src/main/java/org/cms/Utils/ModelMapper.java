package org.cms.Utils;

import java.lang.reflect.Field;

public class ModelMapper {
    private static ModelMapper instance;

    public ModelMapper() {}

    public static ModelMapper getInstance() {
        if(instance == null)
            instance = new ModelMapper();

        return instance;
    }

    public <T> T map(Object src, Class<T> dest) {
        try{
            T destInstance = dest.getDeclaredConstructor().newInstance();

            Field[] srcFields = src.getClass().getDeclaredFields();
            Field[] destFields = destInstance.getClass().getDeclaredFields();

            for(var srcField : srcFields){
                for(var destField : destFields){
                    if(!destField.getName().equals(srcField.getName())) continue;

                    srcField.setAccessible(true);
                    destField.setAccessible(true);

                    destField.set(destInstance, srcField.get(src));
                }
            }

            return destInstance;
        }catch(Exception ex){
            System.out.println(ex.getMessage());
            return null;
        }
    }
}
