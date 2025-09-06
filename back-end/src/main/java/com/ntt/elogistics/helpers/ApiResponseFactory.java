package com.ntt.elogistics.helpers;


import com.ntt.elogistics.dtos.responses.ApiResponse;

public class ApiResponseFactory {

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static ApiResponse<Object> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    public static <T> ApiResponse<T> error(String message,T data) {
        return new ApiResponse<>(false, message, data);
    }
}