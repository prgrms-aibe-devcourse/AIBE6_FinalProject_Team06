package com.example.demo.post.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.post.post.entity.SalesList;


@Repository
public interface SalesListRepository extends JpaRepository<SalesList, Long> {

}
