package mrsisa.project.service;

import mrsisa.project.model.Client;
import mrsisa.project.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    public Client findOne(Long id) {
        return clientRepository.findById(id).orElseGet(null);
    }

    public Client save(Client client) {return clientRepository.save(client);}
}
