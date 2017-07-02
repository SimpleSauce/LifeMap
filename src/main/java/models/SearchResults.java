package models;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;

public class SearchResults {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  //TODO How do we save the ajax response/search term into this column??
  @Column()
  private String results;

  @ManyToOne
  @JsonManagedReference
  @JoinColumn(name="owner_id")
  private User owner;


  //============GETTERS, SETTERS, AND CONSTRUCTORS===========
  public SearchResults() {
  }

  public SearchResults(String results) {
    this.results = results;
  }

  public SearchResults(long id) {
    this.id = id;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getResults() {
    return results;
  }

  public void setResults(String results) {
    this.results = results;
  }

  public User getOwner() {
    return owner;
  }

  public void setOwner(User owner) {
    this.owner = owner;
  }
}
