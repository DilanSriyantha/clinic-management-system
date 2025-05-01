package com.ppag7cms.Utils.PdfUtility;

public interface Callback <T> {
    void onSuccess(T data);
    void onFailure(Exception e);
}
