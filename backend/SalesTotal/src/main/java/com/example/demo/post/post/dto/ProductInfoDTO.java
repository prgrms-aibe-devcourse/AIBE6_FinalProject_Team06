package com.example.demo.post.post.dto;

import java.time.LocalDateTime;

import com.example.demo.post.post.entity.ProductInfo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class ProductInfoDTO {
	private String status;
	
	public ProductInfoDTO (String status) {
		this.status = status;
		
	}
}
