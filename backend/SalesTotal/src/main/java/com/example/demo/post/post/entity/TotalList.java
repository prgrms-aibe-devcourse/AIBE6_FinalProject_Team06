package com.example.demo.post.post.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Entity
public class TotalList {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String contentType;

	private LocalDateTime totalDate;
	private Long totalQualtity;
	private String contents;
	private LocalDateTime createAT;
	private LocalDateTime motifyAT;

	@ManyToOne
	private Trade trade;
}
