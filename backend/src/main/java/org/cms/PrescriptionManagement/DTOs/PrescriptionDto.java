package org.cms.PrescriptionManagement.DTOs;

import java.util.List;

import org.cms.PrescriptionManagement.Models.PrescriptionLine;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionDto {
    private List<PrescriptionLine> prescriptionLines;
}
