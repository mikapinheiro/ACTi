package br.dev.mika.partnersAPI.services;

import br.dev.mika.partnersAPI.DTO.PartnerDTO;
import br.dev.mika.partnersAPI.entities.Partner;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.dev.mika.partnersAPI.repositories.PartnerRepository;

/**
 * Service Partner
 * @author Mika
 */

@Service
public class PartnerService {

    @Autowired
    private PartnerRepository pr;
    
    
    /**
     * Processa a lista completa de Partner
     * @return 
     */
    
    public List<Partner> findAll() {
        List<Partner> result = pr.findAll();
        return result;
    }

    public List<PartnerDTO> findAllDTO() {
        List<Partner> partners = pr.findAll();
        
        // Converte Partner para PartnerDTO
        List<PartnerDTO> result = partners.stream()
                .map(x -> new PartnerDTO(x)).toList();
                
        return result;
        
    }
    
    
}
