package com.example.demo.post.post.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProMoResDTO {
	private String status;
	private Long ID;
	private String ProductNumber;
	private String ProductName;

	private Long Stock;
	private Long ProductPrice;
	private String image;
	private LocalDateTime CreateAT;

	public ProMoResDTO(String status, Long ID, String ProductNumber, String ProductName,  Long Stock,
			Long ProductPrice, String image) {
		this.status = status;
		this.ID = ID;
		this.ProductNumber = ProductNumber;
		this.ProductName = ProductName;

		this.Stock = Stock;
		this.ProductPrice = ProductPrice;
		this.image = image;
		this.CreateAT = LocalDateTime.now();
	}
}
