package br.dev.mika.partnersAPI.controllers;

import br.dev.mika.partnersAPI.DTO.PartnerDTO;
import br.dev.mika.partnersAPI.entities.Partner;
import br.dev.mika.partnersAPI.services.PartnerService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import br.dev.mika.partnersAPI.repositories.PartnerRepository;

/**
 * Partner Controller
 * @author Mika
 */

@RestController
public class PartnerController {

    @Autowired
    private PartnerService pService;
    
    @Autowired
    private PartnerRepository pRepository;
    
    
    /**
     * Endpoint /partners/
     * retorna todos os parceiros da base de dados
     */
    
    @GetMapping("/full")
    public ResponseEntity<List<Partner>> findAll() {
        
        List<Partner> listPartners = pService.findAll();
        if (listPartners.isEmpty()) {
            return ResponseEntity.notFound().build();
            
        } else {
            
            return ResponseEntity.ok(listPartners);
        }
        
    }
    
    @GetMapping("/minimum")
    public ResponseEntity<List<PartnerDTO>> findAllDTO() {
        
        List<PartnerDTO> listPartners = pService.findAllDTO();
        if (listPartners.isEmpty()) {
            return ResponseEntity.notFound().build();
            
        } else {
            
            return ResponseEntity.ok(listPartners);
        }
        
    }
    
    @GetMapping("/byid/{id}")
    public ResponseEntity<Partner> findById(@PathVariable Long id) {
        Optional<Partner> partner = pRepository.findById(id);
        
        if (partner.isPresent()) {
            return ResponseEntity.ok(partner.get());
            
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Partner createPartner(@RequestBody Partner partnerBody) {
        
        return pRepository.save(partnerBody);
        
    }
    
    
    
    
    
    
}
