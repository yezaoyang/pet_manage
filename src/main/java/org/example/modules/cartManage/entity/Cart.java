package org.example.modules.cartManage.entity;

import java.math.BigDecimal;

public class Cart {
        private Integer id;
        private Integer customerId;
        private Integer goodId;
        private Integer quantity;

        private String goodName;
        private BigDecimal price;
        private String imageUrl;



    // --- 关键：必须显式写出无参构造函数 ---
        public Cart() {
        }

        // 如果你有其他带参构造函数，保留它们即可
        public Cart(Integer customerId, Integer goodId, Integer quantity) {
            this.customerId = customerId;
            this.goodId = goodId;
            this.quantity = quantity;
        }


        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public Integer getGoodId() {
            return goodId;
        }

        public void setGoodId(Integer goodId) {
            this.goodId = goodId;
        }

        public Integer getCustomerId() {
            return customerId;
        }

        public void setCustomerId(Integer customerId) {
            this.customerId = customerId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;


        }

        public String getGoodName() {
            return goodName;
        }

        public void setGoodName(String goodName) {
            this.goodName = goodName;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }
}
