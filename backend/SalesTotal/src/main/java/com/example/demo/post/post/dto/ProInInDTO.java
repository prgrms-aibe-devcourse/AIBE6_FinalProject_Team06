package com.example.demo.post.post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProInInDTO {
	private String productNumber;
	private String name;
	private String productType;
	private Long stock;
	private Long price;
	private String image;
}
