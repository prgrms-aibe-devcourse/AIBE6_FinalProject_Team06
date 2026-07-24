package com.example.demo.post.post.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
@AllArgsConstructor
public class Trade {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private Product product;

	@OneToMany(mappedBy = "trade")
	private List<TotalList> totallist= new ArrayList();
	

	@OneToMany(mappedBy = "trade")
	private List<SalesList> saleslist= new ArrayList();
	

	@OneToMany(mappedBy = "trade")
	private List<BuyList> buylist= new ArrayList();
	
	public Trade(Product product) {
		this.product=product;
	}

}
