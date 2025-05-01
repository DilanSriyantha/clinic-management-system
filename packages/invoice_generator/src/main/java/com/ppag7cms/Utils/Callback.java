package com.ppag7cms.Utils;

public interface Callback <T> {
    void onSuccess(T data);
    void onFailure(Exception e);
}
