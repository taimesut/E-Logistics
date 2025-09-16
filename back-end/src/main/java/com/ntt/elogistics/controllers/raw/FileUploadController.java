//package com.ntt.elogistics.controllers;
//
//import com.ntt.elogistics.helpers.ApiResponseFactory;
//import com.ntt.elogistics.services.FileUploadService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/file-upload")
//public class FileUploadController {
//    private final FileUploadService fileUploadService;
//
//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<?> uploadFile(@RequestParam("image")MultipartFile multipartFile) {
//        String url = fileUploadService.uploadFile(multipartFile);
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.created("Upload file thành công",url));
//    }
//}
