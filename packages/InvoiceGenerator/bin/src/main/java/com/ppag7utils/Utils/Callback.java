package com.ppag7utils.Utils;

public interface Callback <T> {
    void onSuccess(T data);
    void onFailure(Exception e);
}
