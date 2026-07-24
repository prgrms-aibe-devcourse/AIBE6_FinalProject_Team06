package com.example.demo.post.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.post.post.entity.Company;
import com.example.demo.post.post.entity.CompanyInfo;


@Repository
public interface CompanyRepository extends JpaRepository<Company, Long>{

		Company findByCompanyInfo(CompanyInfo companyInfo);

		

}
