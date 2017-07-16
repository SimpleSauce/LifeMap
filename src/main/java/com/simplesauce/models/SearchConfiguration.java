package com.simplesauce.models;



import javax.persistence.*;

@Entity
public class SearchConfiguration {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column
  private boolean business = false;

  @Column
  private boolean healthcare = false;

  @Column
  private boolean jobmarket = false;

  @Column
  private boolean tolerance = false;

  @Column
  private boolean outdoors = false;

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public SearchConfiguration() {
  }

  public boolean isBusiness() {
    return business;
  }

  public void setBusiness(boolean business) {
    this.business = business;
  }

  public boolean isHealthcare() {
    return healthcare;
  }

  public void setHealthcare(boolean healthcare) {
    this.healthcare = healthcare;
  }

  public boolean isJobmarket() {
    return jobmarket;
  }

  public void setJobmarket(boolean jobmarket) {
    this.jobmarket = jobmarket;
  }

  public boolean isTolerance() {
    return tolerance;
  }

  public void setTolerance(boolean tolerance) {
    this.tolerance = tolerance;
  }

  public boolean isOutdoors() {
    return outdoors;
  }

  public void setOutdoors(boolean outdoors) {
    this.outdoors = outdoors;
  }

}
