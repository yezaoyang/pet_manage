package org.example.modules.categoryManage.entity;

public class Category {
    private Integer id;
    private String name;
    private String description;
    private Integer cateId; // 注意这里对应数据库的 cate_id
    private String parentName;
    private String level;//

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    // 必须有
    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCateId() {
        return cateId;
    }

    public void setCateId(Integer cateId) {
        this.cateId = cateId;
    }

    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", cateId=" + cateId +
                '}';
    }
}