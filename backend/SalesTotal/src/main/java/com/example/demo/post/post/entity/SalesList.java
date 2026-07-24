package com.example.demo.post.post.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Getter
@Entity
@NoArgsConstructor
public class SalesList {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String contentType;

	private LocalDateTime salesDate;
	private Long salesQualtity;
	private String contents;
	private LocalDateTime createAT;
	private LocalDateTime motifyAT;

	@ManyToOne
	private Trade trade;
	
	public SalesList(String contentType, Long salesQualtity, Trade trade) {
		this.contentType=contentType;
		this.salesDate= LocalDateTime.now();
		this.createAT= LocalDateTime.now();
		this.motifyAT= LocalDateTime.now();
		this.salesQualtity=salesQualtity;
		this.trade=trade;
	}
}
