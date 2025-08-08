package br.dev.mika.partnersAPI.repositories;

import br.dev.mika.partnersAPI.entities.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Interface de Acesso a tabela Partner
 * @author Mika
 */
public interface PartnerRepository extends JpaRepository<Partner, Long>{
    
}
