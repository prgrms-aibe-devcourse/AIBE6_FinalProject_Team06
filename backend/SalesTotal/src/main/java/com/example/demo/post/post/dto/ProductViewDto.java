package com.example.demo.post.post.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ProductViewDto {
	private Long id;
	private String productNumber;
	private String name;

	private Long stock;
	private Long price;
	private String image;
	private LocalDateTime createdAt;

	public ProductViewDto(Long id, String productNumber, String name,  Long stock, Long price,
			String image, LocalDateTime createdAt) {
		this.id = id;
		this.productNumber = productNumber;
		this.name = name;
	
		this.stock = stock;
		this.price = price;
		this.image = image;
		this.createdAt = createdAt;
	}
}
