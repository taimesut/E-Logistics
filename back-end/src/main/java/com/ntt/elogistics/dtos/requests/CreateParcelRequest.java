package com.ntt.elogistics.dtos.requests;

import com.ntt.elogistics.models.Parcel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateParcelRequest {

    private String fromName;
    private String fromPhone;
    private String fromProvince;
    private String fromDistrict;
    private String fromWard;
    private String fromStreet;

    private String toName;
    private String toPhone;
    private String toProvince;
    private String toDistrict;
    private String toWard;
    private String toStreet;

    private double weight;//kg
    private double length;//cm
    private double width;//cm
    private double height;//cm


    public static Parcel toModel(CreateParcelRequest req){
        return Parcel.builder()
                .fromName(req.getFromName())
                .fromPhone(req.getFromPhone())
                .fromProvince(req.getFromProvince())
                .fromDistrict(req.getFromDistrict())
                .fromWard(req.getFromWard())
                .fromStreet(req.getFromStreet())

                .toName(req.getToName())
                .toPhone(req.getToPhone())
                .toProvince(req.getToProvince())
                .toDistrict(req.getToDistrict())
                .toWard(req.getToWard())
                .toStreet(req.getToStreet())

                .weight(req.getWeight())
                .length(req.getLength())
                .width(req.getWidth())
                .height(req.getHeight())

        .build();
    }
}
