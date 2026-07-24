package com.example.demo.member.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.member.member.entity.Auth;
import com.example.demo.member.member.entity.UserInfo;

@Repository
public interface UserRepository extends JpaRepository<UserInfo, Long>{

	UserInfo findByAuth(Auth auth);

}
