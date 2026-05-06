package org.example.modules.goodManage.entity;

import java.math.BigDecimal;

public class Good {
    private Long id;
    private String name;
    private Long categoryId;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private Integer stock;
    private Integer isOnSale;

    // 额外字段：用于展示分类名称
    private String categoryName;

    // Getter and Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Integer getIsOnSale() { return isOnSale; }
    public void setIsOnSale(Integer isOnSale) { this.isOnSale = isOnSale; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}