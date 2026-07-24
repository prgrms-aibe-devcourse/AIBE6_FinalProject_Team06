package com.example.demo.post.post.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListDto {
   
	private Long id;
    private LocalDateTime date;
    private String flow;
    private String company;
    private String product;
    private String member;
    private Long quantity;
    private Long price;
    private String image;
    
}
