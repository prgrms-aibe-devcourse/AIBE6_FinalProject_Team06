package com.example.demo.post.post.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ComInResDTO {
	private String status;
	private Long ID;

	private String CompanyName;
	private String CompanyNumber;
	private LocalDateTime CreateAT;
}
