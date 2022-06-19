package mrsisa.project.service;

import mrsisa.project.model.Address;
import mrsisa.project.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

    public Address findOne(Long id) {
        return addressRepository.getById(id);
    }

    public Address save(Address address) {return addressRepository.save(address);}
}
