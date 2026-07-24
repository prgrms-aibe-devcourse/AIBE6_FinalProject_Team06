package com.example.demo.post.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.post.post.entity.ProductInfo;

@Repository
public interface ProductInfoRepository extends JpaRepository<ProductInfo, Long> {

	ProductInfo findByProductNumber(String productNumber);

	void deleteAllById(Long id);

	ProductInfo findByProductName(String productName);

}
