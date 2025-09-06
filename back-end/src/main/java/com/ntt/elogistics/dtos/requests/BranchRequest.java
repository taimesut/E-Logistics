package com.ntt.elogistics.dtos.requests;

import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.enums.BranchType;
import com.ntt.elogistics.models.Branch;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BranchRequest {
    @NotBlank(message = "Tên chi nhánh không được để trống")
    private String name;
    private String province;
    private String district;
    private String ward;
    private String street;
    private BranchStatus status;

    public static Branch toModel(BranchRequest req){
        return Branch.builder()
                .name(req.getName())
                .street(req.getStreet())
                .ward(req.getWard())
                .district(req.getDistrict())
                .province(req.getProvince())
                .status(req.status)
                .type(BranchType.POST_OFFICE)
                .build();
    }
}
