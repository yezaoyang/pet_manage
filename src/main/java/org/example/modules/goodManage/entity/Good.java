package org.example.modules.goodManage.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

public class Good implements Serializable {
    private Integer id;
    private String name;
    private Integer categoryId; // 对应数据库字段 category_id
    private BigDecimal price;   // 钱一律用 BigDecimal
    private Integer stock;
    private String imageUrl;    // 对应数据库字段 image_url
    private String description;
    private Integer status;
    private Date createTime;
    private Integer isOnSale;
    private String adoptStatus;


    // 无参构造
    public Good() {}

    // Getter 和 Setter 方法
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    public Date getCreateTime() { return createTime; }
    public void setCreateTime(Date createTime) { this.createTime = createTime; }

    public Integer getIsOnSale() { return isOnSale; }
    public void  setIsOnSale(Integer is_on_sale) { this.isOnSale = isOnSale; }

    public void setAdoptStatus(String sold) { this.adoptStatus= adoptStatus;}
    public String getAdoptStatus() { return adoptStatus; }

    @Override
    public String toString() {
        return "Pet{" + "id=" + id + ", name='" + name + '\'' + ", price=" + price + '}';
    }

}