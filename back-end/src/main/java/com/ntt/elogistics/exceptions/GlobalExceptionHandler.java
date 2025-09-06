package com.ntt.elogistics.exceptions;

import com.ntt.elogistics.helpers.ApiResponseFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex){
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("Dữ liệu không hợp lệ");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponseFactory.error(message));
    }

    // @RequestParam, @PathVariable
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(HttpMessageNotReadableException ex){
        String message = "Dữ liệu gửi không hợp lệ";

        // enum
        if (ex.getCause() != null && ex.getCause().getMessage().contains("UserRole")) {
            message = "Role không hợp lệ";
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponseFactory.error(message));
    }


    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<?> handleAccountLockedException(AccountLockedException ex){
        return ResponseEntity.status(ex.getStatus())
                .body(ApiResponseFactory.error(ex.getMessage()));
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<?> handleFileUploadException(FileUploadException ex){
        return ResponseEntity.status(ex.getStatus())
                .body(ApiResponseFactory.error(ex.getMessage()));
    }

    @ExceptionHandler(NotFoundUsernameException.class)
    public ResponseEntity<?> handleNotFoundUsernameException(NotFoundUsernameException ex){
        return ResponseEntity.status(ex.getStatus())
                .body(ApiResponseFactory.error(ex.getMessage()));
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<?> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException ex){
        return ResponseEntity.status(ex.getStatus())
                .body(ApiResponseFactory.error(ex.getMessage()));
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<?> handleCustomException(CustomException ex){
        return ResponseEntity.status(ex.getStatus())
                .body(ApiResponseFactory.error(ex.getMessage()));
    }


}
