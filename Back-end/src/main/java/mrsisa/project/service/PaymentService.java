package mrsisa.project.service;

import mrsisa.project.model.Adventure;
import mrsisa.project.model.Payment;
import mrsisa.project.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    PaymentRepository paymentRepository;

    public double getMoneyPercentage() {
        Payment payment = paymentRepository.findAll().get(0);
        return payment.getMoneyPercentage();
    }

    public double getTotalMoney() {
        Payment payment = paymentRepository.findAll().get(0);
        return payment.getTotal();
    }

    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }
}
