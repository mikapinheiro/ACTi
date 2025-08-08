package br.dev.mika.partnersAPI.entities;

import br.dev.mika.partnersAPI.model.TipoParceiro;
import br.dev.mika.partnersAPI.model.TipoPersona;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 *
 * @author Mika
 */

@Entity
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    @Enumerated(EnumType.STRING)
    private TipoParceiro tipo;
    
    @Enumerated(EnumType.STRING)
    private TipoPersona tipoPersona;
    
    @NotBlank
    private String razaoSocial;
    private String nomeFantasia;
    
    @NotBlank
    private String cnpjCpf;
    private String segmento;
    private String categoria;
    private String cep;
    private String pais;
    private String uf;
    private String municipio;
    private String logradouro;
    private int numero;
    private String complemento;
    private String bairro;
    
    @NotBlank
    @Email
    private String email;
    private String telefone;
    private String celular;
    private String observacao;

    public Partner() {
    }

    public Partner(long id, TipoParceiro tipo, TipoPersona tipoPersona, String razaoSocial, String nomefantasia, String cnpjCpf, String segmento, String categoria, String cep, String pais, String uf, String municipio, String logradouro, int numero, String complemento, String bairro, String email, String telefone, String celular, String observacao) {
        this.id = id;
        this.tipo = tipo;
        this.tipoPersona = tipoPersona;
        this.razaoSocial = razaoSocial;
        this.nomeFantasia = nomefantasia;
        this.cnpjCpf = cnpjCpf;
        this.segmento = segmento;
        this.categoria = categoria;
        this.cep = cep;
        this.pais = pais;
        this.uf = uf;
        this.municipio = municipio;
        this.logradouro = logradouro;
        this.numero = numero;
        this.complemento = complemento;
        this.bairro = bairro;
        this.email = email;
        this.telefone = telefone;
        this.celular = celular;
        this.observacao = observacao;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public TipoParceiro getTipo() {
        return tipo;
    }

    public void setTipo(TipoParceiro tipo) {
        this.tipo = tipo;
    }

    public TipoPersona getTipoPersona() {
        return tipoPersona;
    }

    public void setTipoPersona(TipoPersona tipoPersona) {
        this.tipoPersona = tipoPersona;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public String getCnpjCpf() {
        return cnpjCpf;
    }

    public void setCnpjCpf(String cnpjCpf) {
        this.cnpjCpf = cnpjCpf;
    }

    public String getSegmento() {
        return segmento;
    }

    public void setSegmento(String segmento) {
        this.segmento = segmento;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public String getMunicipio() {
        return municipio;
    }

    public void setMunicipio(String municipio) {
        this.municipio = municipio;
    }

    public String getLogradouro() {
        return logradouro;
    }

    public void setLogradouro(String logradouro) {
        this.logradouro = logradouro;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 17 * hash + (int) (this.id ^ (this.id >>> 32));
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Partner other = (Partner) obj;
        return this.id == other.id;
    }
    
}
