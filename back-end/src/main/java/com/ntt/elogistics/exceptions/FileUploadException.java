package com.ntt.elogistics.exceptions;

import org.springframework.http.HttpStatus;

public class FileUploadException extends CustomException {
    public FileUploadException(String name) {
        super("Lỗi khi upload file: " + name, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
