package com.ntt.elogistics.services;

import com.cloudinary.Cloudinary;
import com.ntt.elogistics.exceptions.CustomException;
import com.ntt.elogistics.exceptions.FileUploadException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadService {
    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try{
            return cloudinary
                    .uploader()
                    .upload(file.getBytes(),
                            Map.of("public_id", UUID.randomUUID().toString()))
                    .get("url")
                    .toString();
        }
        catch (Exception e){
            throw new CustomException("Lỗi upload cloudinary", HttpStatus.BAD_REQUEST);
        }
    }

    public List<String> uploadFiles(List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(uploadFile(file));
        }
        return urls;
    }
}
