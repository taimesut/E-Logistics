package com.ntt.elogistics.services;

import com.ntt.elogistics.enums.ImageParcelType;
import com.ntt.elogistics.models.ImageParcel;
import com.ntt.elogistics.repositories.ImageParcelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageParcelService {
    private final FileUploadService fileUploadService;
    private final ImageParcelRepository imageParcelRepository;


    public List<String> uploadImages(String parcelId, ImageParcelType type, List<MultipartFile> files){
        List<String> urls = fileUploadService.uploadFiles(files);
        for(String url:urls){
            ImageParcel i = ImageParcel.builder()
                    .parcelId(parcelId)
                    .type(type)
                    .url(url)
                    .build();
            imageParcelRepository.save(i);
        }
        return urls;
    }

    public List<ImageParcel> getImagesParcel(String parcelId){
        return imageParcelRepository.findByParcelId(parcelId);
    }
}
