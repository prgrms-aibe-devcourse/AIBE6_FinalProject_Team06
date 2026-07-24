package com.example.demo.member.member.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.demo.member.member.service.MemberService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class MemberController {
	private final MemberService memberservice;
	
}
