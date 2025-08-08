package br.dev.mika.partnersAPI.DTO;

import br.dev.mika.partnersAPI.entities.Partner;
import br.dev.mika.partnersAPI.model.TipoParceiro;
import br.dev.mika.partnersAPI.model.TipoPersona;

/**
 * Representação básica do Partner
 * @author Mika
 */
public class PartnerDTO {
    
    private long id;
    private TipoParceiro tipo;
    private TipoPersona tipoPersona;
    private String razaoSocial;
    private String nomeFantasia;

    private String telefone;
    private String celular;

    public PartnerDTO() {
    }

    public PartnerDTO(Partner pOrigem) {
        this.id = pOrigem.getId();
        this.tipo = pOrigem.getTipo();
        this.tipoPersona = pOrigem.getTipoPersona();
        this.razaoSocial = pOrigem.getRazaoSocial();
        this.nomeFantasia = pOrigem.getNomeFantasia();
        this.telefone = pOrigem.getTelefone();
        this.celular = pOrigem.getCelular();
    }

    public long getId() {
        return id;
    }

    public TipoParceiro getTipo() {
        return tipo;
    }

    public TipoPersona getTipoPersona() {
        return tipoPersona;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getCelular() {
        return celular;
    }

    
    
}
