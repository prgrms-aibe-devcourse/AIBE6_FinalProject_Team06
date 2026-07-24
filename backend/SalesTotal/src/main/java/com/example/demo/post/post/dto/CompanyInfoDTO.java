package com.example.demo.post.post.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class CompanyInfoDTO {

	private String status;

	public CompanyInfoDTO(String status) {
		this.status = status;

	}
}
