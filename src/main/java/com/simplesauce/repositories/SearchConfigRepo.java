package com.simplesauce.repositories;

import com.simplesauce.models.SearchConfiguration;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchConfigRepo extends CrudRepository<SearchConfiguration, Long> {
}
