package mrsisa.project.service;

import mrsisa.project.model.Address;
import mrsisa.project.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

    public Address findOne(Long id) {
        return addressRepository.findById(id).orElseGet(null);
    }

    public Address save(Address address) {return addressRepository.save(address);}
}
