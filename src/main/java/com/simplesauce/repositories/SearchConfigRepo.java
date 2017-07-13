package com.simplesauce.repositories;

import com.simplesauce.models.SearchConfiguration;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by jerik0 on 7/13/17.
 */
@Repository
public interface SearchConfigRepo extends CrudRepository<SearchConfiguration, Long> {
}
