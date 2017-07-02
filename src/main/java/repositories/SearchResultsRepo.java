package repositories;

import models.SearchResults;
import org.springframework.data.repository.CrudRepository;

public interface SearchResultsRepo extends CrudRepository<SearchResults, Long>{
}
